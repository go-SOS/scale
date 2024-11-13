import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Tooltip } from '@mui/material';

export default function ViewSwitcher({ onViewModeChange, onViewListChange, isChecked, handleCaptureClick, from, view }) {

    return (
        <>
            <div className="flex justify-between ml-1">
                <div className="mt-4 flex">
                    <label className="Switch_Toggle">
                        <input
                            type="checkbox"
                            defaultChecked={isChecked}
                            className="w-4 h-4 mr-1 cursor-pointer"
                            onClick={() => onViewListChange(!isChecked)}
                        />
                        <span className="Slider" />
                    </label>
                    <div className="-mt-[2px]">
                        Show Work Item List
                    </div>
                </div>
                <div className="ViewContainer flex justify-end mr-1 mt-1">
                    {from !== "Board" && (
                        <Tooltip title="Screenshot" arrow placement="top">
                            <button
                                className="hover:bg-slate-50 bg-white ml-1 mr-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2"
                                onClick={() => handleCaptureClick()}
                            >
                                <CameraAltIcon className="w-5 h-5" color="action" />
                            </button>
                        </Tooltip>
                    )}
                    <div className="flex">
                        <div
                            onClick={() => {
                                onViewModeChange(ViewMode.QuarterDay);
                            }}
                            className={`hover:bg-slate-50 text-[13px] cursor-pointer bg-white ml-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2`}
                            style={view === 'Quarter Day' ? { fontWeight: '600', backgroundColor: '#bfdbfe' } : {}}
                        >
                            Quarter day
                        </div>
                        <div
                            onClick={() => {
                                onViewModeChange(ViewMode.HalfDay);
                            }}
                            className={`hover:bg-slate-50 text-[13px] cursor-pointer bg-white ml-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2`}
                            style={view === 'Half Day' ? { fontWeight: '600', backgroundColor: '#bfdbfe' } : {}}
                        >
                            Half day
                        </div>
                        <div
                            onClick={() => {
                                onViewModeChange(ViewMode.Day);
                            }}
                            className={`hover:bg-slate-50 text-[13px] cursor-pointer bg-white ml-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2`}
                            style={view === 'Day' ? { fontWeight: '600', backgroundColor: '#bfdbfe' } : {}}
                        >
                            Today
                        </div>
                        <div
                            onClick={() => {
                                onViewModeChange(ViewMode.Week);
                            }}
                            className={`hover:bg-slate-50 text-[13px] cursor-pointer bg-white ml-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2`}
                            style={view === 'Week' ? { fontWeight: '600', backgroundColor: '#bfdbfe' } : {}}
                        >
                            Week
                        </div>
                        <div
                            onClick={() => {
                                onViewModeChange(ViewMode.Month);
                            }}
                            className={`hover:bg-slate-50 text-[13px] cursor-pointer bg-white ml-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2`}
                            style={view === 'Month' ? { fontWeight: '600', backgroundColor: '#bfdbfe' } : {}}
                        >
                            Month
                        </div>
                    </div>
                </div>
            </div>

        </>

    );
}
