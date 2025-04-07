import useChangeView from "@/Hooks/useChangeView";
import useDetalles from "@/Hooks/useDetalles";
import React, { useEffect, useState } from "react";

export default function Article({
	namesUrlCategories,
	dragActive,
	dataEditableRef,
	setEdiciones,
	handleVisionItem,
	EditionMode,
	NormalMode,
	editionModeState,
	logged,
	data,
	ediciones,
	galleryRef,
	cardRef,
	imagesHaveChanged,
	viewerMode,
}) {
	const { details, handleDetails, p } = useDetalles(namesUrlCategories, dataEditableRef);

	let baseURL = `${process.env.NEXT_PUBLIC_URL}`;

	for (const index in namesUrlCategories) {
		if (namesUrlCategories.length > 0) {
			baseURL = baseURL.concat(`/${namesUrlCategories[index].replaceAll(" ", "-")}`);
		}
	}

	useEffect(() => {
		console.log("Cambia viewer mode: ", viewerMode);
	}, [viewerMode]);

	//Ver si no carga el modo ediciones igualmente, tal vez haya que usar cookies

	return (
		<article>
			{editionModeState && logged && data && viewerMode !== null && ediciones[0] ? (
				<EditionMode
					data={data}
					dataEditableRef={dataEditableRef}
					viewerMode={viewerMode}
					setEdiciones={setEdiciones}
					dragActive={dragActive}
					logged={logged}
					handleVisionItem={handleVisionItem}
					imagesHaveChanged={imagesHaveChanged}
					galleryRef={galleryRef}
					ediciones={ediciones}
				/>
			) : (
				<NormalMode
					handleDetails={handleDetails}
					viewerMode={viewerMode}
					p={p}
					details={details}
					baseURL={baseURL}
					galleryRef={galleryRef}
					cardRef={cardRef}
					ediciones={ediciones}
				/>
			)}
		</article>
	);
}
