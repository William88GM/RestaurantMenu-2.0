import { NextResponse } from "next/server";
import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(req, res) {

    const credentials = new S3Client({
        region: "auto",
        endpoint: process.env.endpoint ?? "",
        credentials: {
            accessKeyId: process.env.accessKeyId ?? "",
            secretAccessKey: process.env.secretAccessKey ?? ""
        }
    });
    //hola
    const fileKey = `imagesInterface.json`;

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


        console.error("Error al crear el archivo:", err);
        return NextResponse.json({ error: "No se pudo crear el archivo" }, { status: 500 });


    }
}
