"use client";
import View from './rightView';
import TableView from "@/common/tableView";

export default function SplitView({ rows, from }) {
    return (
        <>
            <div className="container mx-auto">
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg shadow-sm">
                        <TableView rows={rows} from={from} />
                    </div>
                    <div className="bg-white rounded-lg mt-4 shadow-sm">
                        <View from={from} />
                    </div>
                </div>
            </div>
        </>

    );
}
