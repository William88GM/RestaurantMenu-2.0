import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(req) {
    const body = await req.json();
    const token = cookies().get("token");
    // console.log("CUERPO", body);
    let settings, user;

    try {

        const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.jwtkey));
        user = payload;
        // console.log(user);
    } catch (err) {
        console.log(err);
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
            try {

                const dataToModify = new PutObjectCommand({
                    Bucket: "lavenesj",
                    Key: "settings.json",
                    Body: JSON.stringify(body.formData),
                });
                const response = await credentials.send(dataToModify);
                // console.log(response);



                const imagesToModify = new PutObjectCommand({
                    Bucket: "lavenesj",
                    Key: "imagesInterface.json",
                    Body: JSON.stringify(body.imagesInterface),
                });
                const response2 = await credentials.send(imagesToModify);
                // console.log(response2);



                // let newDataGrande = body.data.interface.socialMedia.find((e)=>e.id===)


                // console.log(body.formData);
                let nuevoSocialMedia = body.data.interface.socialMedia.map((e) => {
                    // console.log(e.id);
                    if (body.formData[`socialName-${e.id}`] || body.formData[`socialLink-${e.id}`]) {
                        // console.log("LLEGA ACA SI O NO??!??!?!??!");
                        return {
                            name: body.formData[`socialName-${e.id}`] || "",
                            link: body.formData[`socialLink-${e.id}`] || "",
                            id: e.id
                        }
                    } else {
                        return e
                    }
                })

                body.data.interface.socialMedia = nuevoSocialMedia
                body.data.interface.productsListViewMode = body.formData.productsListViewMode
                // console.log("body.formData", body.formData);

                const dataGrandeToModify = new PutObjectCommand({
                    Bucket: "lavenesj",
                    Key: "dataGrande.json",
                    Body: JSON.stringify(body.data),
                });
                const response3 = await credentials.send(dataGrandeToModify);
                // console.log(response3);




                return NextResponse.json({ message: "Modificado correctamente" }, { status: 200 });
            } catch (err) {
                console.log(err);
                return NextResponse.json({ error: "No se pudo actualizar la data" }, { status: 500 });
            }



        }
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "No se pudo actualizar" }, { status: 400 });
    }
}
