import type { CSVEntity } from "@/Entity/CSVEntity.js";
import { convertToCSV } from "@/Helper/convertToCSV.js";
import { LucideDownload } from "lucide-react";
import { useState } from "react";

type DownloadCSVButtonProps = {
	fileName: string;
	csvEntities: CSVEntity[];
};

export const DownloadCSVButton = ({ fileName, csvEntities }: DownloadCSVButtonProps) => {
	const [showLabel, setShowLabel] = useState(false);

	const handleDownload = () => {
		const csv = convertToCSV(csvEntities);

		const BOM = "\uFEFF"; // Add BOM here

		const blob = new Blob([BOM + csv], {
			type: "text/csv;charset=utf-8;",
		});

		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", fileName);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		document.body.removeChild(link);
	};

	return (
		<div className="card-hover relative inline-block text-white p-3.5" onClick={handleDownload} onMouseEnter={() => setShowLabel(true)} onMouseLeave={() => setShowLabel(false)}>
			<LucideDownload size={15} />
			{showLabel && <div className="absolute -top-8 right-1/2 transform translate-x-1/2 bg-black text-white text-xs rounded-md px-2 py-1 whitespace-nowrap">CSVダウンロード</div>}
		</div>
	);
};
