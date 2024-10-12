import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req) {
    let user, token;

    try {
        token = cookies().get("token");


        const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.jwtkey));
        user = payload;

        cookies().delete("token");

        // console.log(user);
        return NextResponse.json({ error: "Cerrada correctamente" }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
