import { NextResponse } from "next/server";
import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export async function POST(req, res) {
    const body = await req.json();

    const credentials = new S3Client({
        region: "auto",
        endpoint: process.env.endpoint ?? "",
        credentials: {
            accessKeyId: process.env.accessKeyId ?? "",
            secretAccessKey: process.env.secretAccessKey ?? ""
        }
    });
    //hola
    const fileKey = `${body.idSection}.json`;

    // Intenta obtener el archivo de S3
    try {
        const getFileCommand = new GetObjectCommand({
            Bucket: "lavenesj",
            Key: fileKey,
        });

        const response = await credentials.send(getFileCommand);
        const str = await response.Body.transformToString();


        // console.log("Archivo existente encontrado:", str);


        return NextResponse.json({ message: 'Archivo existente encontrado', body: str });

    } catch (err) {
        if (err.name === 'NoSuchKey') {
            // Si el archivo no existe, crea uno nuevo
            // console.log("El archivo no existe, creando uno nuevo...");

            const initialData = {
                "idSection": `${body.idSection}`,
                "imagesBase64": [
                    {
                        "idElement": "",
                        "src": ""
                    }
                ]
            };
            const putFileCommand = new PutObjectCommand({
                Bucket: "lavenesj",
                Key: fileKey,
                Body: JSON.stringify(initialData),
                ContentType: "application/json",
            });

            try {
                await credentials.send(putFileCommand);
                // console.log("Archivo creado con éxito.");


                return NextResponse.json({ message: 'Archivo creado', body: JSON.stringify(initialData) });
            } catch (putErr) {
                console.error("Error al crear el archivo:", putErr);
                return NextResponse.json({ error: "No se pudo crear el archivo" }, { status: 500 });
            }
        } else {
            console.error("Error al obtener el archivo:", err);
            return NextResponse.json({ error: "No se pudo obtener la data" }, { status: 400 });
        }
    }
}
