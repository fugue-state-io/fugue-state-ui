import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

import getUuid from "uuid-by-string";

import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

// @ts-expect-error
import { authOptions } from "../auth/[...nextauth]/route.ts";
import { time } from "console";

const Bucket = process.env.FUGUE_STATE_BUCKET;
const client = new S3Client({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: "https://nyc3.digitaloceanspaces.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.FUGUE_STATE_CDN_ACCESS_ID,
    secretAccessKey: process.env.FUGUE_STATE_CDN_SECRET_KEY,
  },
});

// return all project ids for user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session) {
    let user_uuid = getUuid(session.user.email, 5);
    const response = await client.send(
      new ListObjectsCommand({ Bucket: Bucket, Prefix: user_uuid })
    );
    return Response.json(response?.Contents ?? []);
  } else {
    return Response.json(null, { status: 401, statusText: "No Session" });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    let user_uuid = getUuid(session.user.email, 5);
    let proj_uuid = getUuid(session.user.email + Date.now(), 5);
    let Body = (await request.arrayBuffer())
    let response = client.send(
      new PutObjectCommand({
        Bucket,
        Key: user_uuid + "/" + proj_uuid + "/" + getUuid(Date.now().toString(), 5),
        Body: Body,
        ContentLength: Body.byteLength
      })
    );
    return Response.json(response);
  } else {
    return Response.json(null, { status: 401, statusText: "No Session" });
  }
}
