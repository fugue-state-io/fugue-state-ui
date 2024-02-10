import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

import getUuid from "uuid-by-string";

import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { authOptions } from "fugue-state-ui/constants/authOptions";
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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session && session.user && session.user.email) {
    let user_uuid = getUuid(session.user.email, 5);
    let proj_uuid = getUuid(session.user.email + Date.now(), 5);
    let Body = await request.arrayBuffer();
    let meta = JSON.stringify({
      created: Date.now(),
      media: user_uuid + "/" + proj_uuid,
      name: "Unnamed Project",
    });
    client.send(
      new PutObjectCommand({
        Bucket,
        Key: user_uuid + "/metadata_" + proj_uuid,
        Body: meta,
        ContentLength: meta.length,
      })
    );
    let response = client.send(
      new PutObjectCommand({
        Bucket,
        Key: user_uuid + "/" + proj_uuid,
        Body: Body,
        ContentLength: Body.byteLength,
      })
    );
    return NextResponse.json(response);
  } else {
    return NextResponse.json(null, { status: 401, statusText: "No Session" });
  }
}
