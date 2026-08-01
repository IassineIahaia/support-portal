import { http, HttpResponse } from "msw";
import { mockRequests } from "./data";
import type { components } from "@/shared/types/api";

type ServiceRequest = components["schemas"]["ServiceRequest"];
type CreateServiceRequest = components["schemas"]["CreateServiceRequest"];
type UpdateStatus = components["schemas"]["UpdateServiceRequestStatus"];
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type MutableServiceRequest = Mutable<ServiceRequest>;

const db: MutableServiceRequest[] = [...mockRequests];
let nextIdNumber = 1005;

const VALID_TRANSITIONS: Record<string, string[]> = {
  OPEN: ["IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["RESOLVED", "OPEN"],
  RESOLVED: ["CLOSED", "IN_PROGRESS"],
  CLOSED: [],
};

function problem(
  status: number,
  title: string,
  detail: string,
  instance: string,
) {
  return HttpResponse.json(
    {
      type: `https://api.example.test/problems/${title.toLowerCase().replace(/\s+/g, "-")}`,
      title,
      status,
      detail,
      instance,
      traceId: crypto.randomUUID().slice(0, 12),
    },
    { status, headers: { "Content-Type": "application/problem+json" } },
  );
}

export const handlers = [
  http.get("/api/requests", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase();
    const status = url.searchParams.get("status");
    const priority = url.searchParams.get("priority");
    const sort = url.searchParams.get("sort") ?? "-createdAt";
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");

    let filtered = [...db];

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(search) ||
          r.requesterName.toLowerCase().includes(search),
      );
    }
    if (status) filtered = filtered.filter((r) => r.status === status);
    if (priority) filtered = filtered.filter((r) => r.priority === priority);

    const field = sort.startsWith("-") ? sort.slice(1) : sort;
    const direction = sort.startsWith("-") ? -1 : 1;
    filtered.sort((a, b) => {
      const va = a[field as keyof ServiceRequest];
      const vb = b[field as keyof ServiceRequest];
      if (va === undefined || vb === undefined) return 0;
      return va > vb ? direction : va < vb ? -direction : 0;
    });

    const total = filtered.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ items, page, pageSize, total, totalPages });
  }),

  http.post("/api/requests", async ({ request }) => {
    const body = (await request.json()) as CreateServiceRequest;
    const errors: Record<string, string[]> = {};

    if (!body.title || body.title.length < 3)
      errors.title = ["Title must be at least 3 characters long."];
    if (!body.requesterEmail?.includes("@"))
      errors.requesterEmail = ["Enter a valid email address."];

    if (Object.keys(errors).length > 0) {
      return HttpResponse.json(
        {
          type: "https://api.example.test/problems/validation-error",
          title: "Validation failed",
          status: 422,
          detail: "The submitted service request contains invalid fields.",
          instance: "/api/requests",
          traceId: crypto.randomUUID().slice(0, 12),
          errors,
        },
        {
          status: 422,
          headers: { "Content-Type": "application/problem+json" },
        },
      );
    }

    const id = `REQ-${nextIdNumber++}`;
    const now = new Date().toISOString();
    const created: ServiceRequest = {
      ...body,
      id,
      status: "OPEN",
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    db.unshift(created);

    return HttpResponse.json(created, {
      status: 201,
      headers: { Location: `/api/requests/${id}` },
    });
  }),

  http.get("/api/requests/:id", ({ params }) => {
    const found = db.find((r) => r.id === params.id);
    if (!found) {
      return problem(
        404,
        "Service request not found",
        `No service request exists with id ${params.id}.`,
        `/api/requests/${params.id}`,
      );
    }
    return HttpResponse.json(found);
  }),

  http.patch("/api/requests/:id/status", async ({ params, request }) => {
    const found = db.find((r) => r.id === params.id);
    const instance = `/api/requests/${params.id}/status`;
    if (!found) {
      return problem(
        404,
        "Service request not found",
        `No service request exists with id ${params.id}.`,
        instance,
      );
    }

    const body = (await request.json()) as UpdateStatus;

    if (body.version !== found.version) {
      return problem(
        409,
        "Update conflict",
        "The request was updated by someone else. Refresh and try again.",
        instance,
      );
    }

    const allowed = VALID_TRANSITIONS[found.status] ?? [];
    if (!allowed.includes(body.status)) {
      return HttpResponse.json(
        {
          type: "https://api.example.test/problems/validation-error",
          title: "Invalid status transition",
          status: 422,
          detail: `A ${found.status} request cannot move to ${body.status}.`,
          instance,
          traceId: crypto.randomUUID().slice(0, 12),
          errors: {
            status: [
              `Transition from ${found.status} to ${body.status} is not allowed.`,
            ],
          },
        },
        {
          status: 422,
          headers: { "Content-Type": "application/problem+json" },
        },
      );
    }

    found.status = body.status;
    found.version += 1;
    found.updatedAt = new Date().toISOString();

    return HttpResponse.json(found);
  }),
];
