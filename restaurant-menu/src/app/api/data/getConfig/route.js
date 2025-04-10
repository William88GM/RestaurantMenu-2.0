import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req) {
    let user, settings, token;

    try {
        token = cookies().get("token");


        const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.jwtkey));
        user = payload;
        // console.log(user);
    } catch (err) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    try {
        const fileKey = `settings.json`;
        const credentials = new S3Client({
            region: "auto",
            endpoint: process.env.endpoint ?? "",
            credentials: {
                accessKeyId: process.env.accessKeyId ?? "",
                secretAccessKey: process.env.secretAccessKey ?? ""
            }
        });

        const getFileCommand = new GetObjectCommand({
            Bucket: "lavenesj",
            Key: fileKey,
        });

        const response = await credentials.send(getFileCommand);
        settings = await response.Body.transformToString();
        settings = JSON.parse(settings);

        if (settings.user === user.user && settings.password === user.password) {
            return NextResponse.json({ settings: JSON.stringify(settings) }, { status: 200 });

        }
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
