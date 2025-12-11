import { NextResponse } from "next/server";

/**
 * Custom response helper
 * @param {boolean} success
 * @param {number} statusCode
 * @param {string} message
 * @param {any} [data]
 */
export function response(success, statusCode, message, data) {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status: statusCode }
  )
}
