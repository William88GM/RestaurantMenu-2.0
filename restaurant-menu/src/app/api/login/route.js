import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function POST(req, res) {
    const body = await req.json();
    // console.log(body);
    let settings;

    const credentials = new S3Client({
        region: "auto",
        endpoint: process.env.endpoint ?? "",
        credentials: {
            accessKeyId: process.env.accessKeyId ?? "",
            secretAccessKey: process.env.secretAccessKey ?? ""
        }
    });
    const fileKey = `settings.json`;

    try {
        const getFileCommand = new GetObjectCommand({
            Bucket: "lavenesj",
            Key: fileKey,
        });

        const response = await credentials.send(getFileCommand);
        settings = await response.Body.transformToString();
        settings = JSON.parse(settings);

        console.log("Archivo existente encontrado:", settings);
    } catch (err) {
        console.error("Error al obtener el archivo:", err);
        return NextResponse.json({ error: "No se pudo obtener la data" }, { status: 500 });
    }

    if (settings.user === body.user && settings.password === body.password) {

        const token = await new SignJWT({
            user: settings.user,
            password: settings.password
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('30d')
            .sign(new TextEncoder().encode(process.env.jwtkey));

        cookies().set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });

        return NextResponse.json({ message: "Loggeado correctamente" }, { status: 200 });
    }

    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 400 });
}
