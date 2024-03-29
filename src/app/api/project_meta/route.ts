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

// return all project ids for user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session && session.user && session.user.email) {
    let results = [];
    let user_uuid = getUuid(session.user.email, 5);
    const response = await client.send(
      new ListObjectsCommand({
        Bucket: Bucket,
        Prefix: user_uuid + "/metadata_",
      })
    );

    for (let item in response.Contents) {
      let result = await client.send(
        new GetObjectCommand({
          Bucket: Bucket,
          Key: response.Contents[item].Key,
        })
      );
      let body = JSON.parse(await result.Body.transformToString());
      results[results.length] = body;
    }
    return NextResponse.json(results ?? []);
  } else {
    return NextResponse.json(null, { status: 401, statusText: "No Session" });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session && session.user && session.user.email) {
    let meta = await request.json();
    if (meta["name"] === "") {
      meta["name"] = "Untitled";
    }
    
    if (meta["name"] != null) {
      let user_uuid = getUuid(session.user.email, 5);
      let proj_uuid = getUuid(session.user.email + Date.now(), 5);
      meta["media"] = user_uuid + "/" + proj_uuid
      await client.send(
        new PutObjectCommand({
          Bucket,
          Key: user_uuid + "/metadata_" + proj_uuid,
          Body: JSON.stringify(meta),
          ContentLength: JSON.stringify(meta).length,
        })
      );
      return NextResponse.json(meta);
    } else {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Invalid Request",
      });
    }
  } else {
    return NextResponse.json(null, { status: 401, statusText: "No Session" });
  }
}
