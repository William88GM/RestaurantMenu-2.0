import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req) {
    let user, settings, token;
    const { searchParams } = new URL(req.url);
    console.log("EL TOKEN", searchParams.get("token"));
    token = searchParams.get("token");
    try {
        if (token) {
            const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.jwtkey));
            user = payload;
        } else {

            token = cookies().get("token");

            const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.jwtkey));
            user = payload;
        }
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
        console.log("LLEGA HASTA AQUI?");
        if (settings.user === user.user && settings.password === user.password) {
            cookies().set({
                name: 'token',
                value: token.value,
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 24 * 30,
            });
            return NextResponse.json({ message: "AutoLogged" }, { status: 200 });
        }
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
