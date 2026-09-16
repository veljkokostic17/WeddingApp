export class ApiError extends Error {
  status: number;
  /**
   * The parsed error response body, when the server sent one. Null when the
   * response wasn't JSON. The transport layer only carries it — each screen
   * decides what its endpoint's error shape means.
   */
  body: unknown;

  constructor(message: string, status: number, body: unknown = null) {
    super(message);
    this.status = status;
    this.body = body;
  }
}
