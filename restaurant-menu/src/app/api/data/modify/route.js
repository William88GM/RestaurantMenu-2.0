import { NextResponse } from "next/server";
import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";


export const runtime = 'edge';

export async function PUT(req) {
    const body = await req.json();
    const token = cookies().get("token");
    let settings, user;

    try {

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
            const dataAll = body.dataAll;
            const dataToModify = new PutObjectCommand({
                Bucket: "lavenesj",
                Key: "dataGrande.json",
                Body: JSON.stringify(dataAll),
            });

            let imagesToModify = {};
            if (body.images && body.imagesHaveChanged) {
                // console.log("imagenes", body.images); //no todas las vistas mandan imagenes, cuidado
                imagesToModify = new PutObjectCommand({
                    Bucket: "lavenesj",
                    Key: `${body.images.idSection}.json`,
                    Body: JSON.stringify(body.images),
                });
            }

            try {
                const response = await credentials.send(dataToModify);
                // console.log(response);
                if (body.images && body.imagesHaveChanged) {
                    const response2 = await credentials.send(imagesToModify);
                    console.log(response2);
                }
                return NextResponse.json({ message: "Actualizado" }, { status: 200 });
            } catch (error) {
                console.error(error);
                return NextResponse.json({ error: "No se pudo actualizar" }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "No se pudo actualizar" }, { status: 400 });
    }
}
