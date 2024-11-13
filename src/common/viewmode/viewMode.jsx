import GridOnIcon from '@mui/icons-material/GridOn';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import useAppStore from '@/store/appStore';
import { Tooltip } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';


export default function ViewMode({ rows, kanban, timeline}) {
    const { updateViewMode, viewMode } = useAppStore();
    const disabled = rows.length === 0;

    const handleListViewChange = (text) => {
        if (!disabled) {
            updateViewMode(text);
        }
    }

    return (
        <div className="flex">
            <Tooltip title="Table View" arrow placement="top">
                <div
                    onClick={() => handleListViewChange('Table')}
                    className={`hover:bg-slate-50 cursor-pointer bg-white ml-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2 ${disabled ? 'disabled' : ''}`}
                    style={viewMode === 'Table' ? { fontWeight: '600', backgroundColor: '#bfdbfe' } : {}}
                >
                    <GridOnIcon sx={{ fontSize: 20 }} className="text-slate-600" />
                </div>
            </Tooltip>
            <Tooltip title="Split View" arrow placement="top">
                <div
                    onClick={() => handleListViewChange('Split')}
                    className={`hover:bg-slate-50 cursor-pointer bg-white ml-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2 ${disabled ? 'disabled' : ''}`}
                    style={viewMode === 'Split' ? { fontWeight: '600', backgroundColor: '#bfdbfe' } : {}}
                >
                    <VerticalSplitIcon sx={{ fontSize: 20 }} className="text-slate-600" />
                </div>
            </Tooltip>
            <Tooltip title="Kanban View" arrow placement="top">
                {kanban === undefined && (
                    <div
                        onClick={() => handleListViewChange('Kanban')}
                        className={`hover:bg-slate-50 cursor-pointer bg-white ml-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2 ${disabled ? 'disabled' : ''}`}
                        style={viewMode === 'Kanban' ? { fontWeight: '600', backgroundColor: '#bfdbfe' } : {}}
                    >
                        <ViewKanbanIcon sx={{ fontSize: 20 }} className="text-slate-600" />
                    </div>
                )}
            </Tooltip>
            <Tooltip title="Timeline View" arrow placement="top">
                {timeline === true && (
                    <div
                        onClick={() => handleListViewChange('Timeline')}
                        className={`hover:bg-slate-50 cursor-pointer bg-white ml-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2 ${disabled ? 'disabled' : ''}`}
                        style={viewMode === 'Timeline' ? { fontWeight: '600', backgroundColor: '#bfdbfe' } : {}}
                    >
                        <TimelineIcon sx={{ fontSize: 20 }} className="text-slate-600" />
                    </div>
                )}
            </Tooltip>
          
            <Tooltip title="Card View" arrow placement="top">
                <div
                    onClick={() => handleListViewChange('Card')}
                    className={`hover:bg-slate-50 cursor-pointer bg-white ml-1 border min-w-[20px] justify-center border-slate-200 shadow-sm hover:shadow-md text-slate-900 py-1 px-2 flex items-center space-x-2 rounded mb-2 ${disabled ? 'disabled' : ''}`}
                    style={viewMode === 'Card' ? { fontWeight: '600', backgroundColor: '#bfdbfe' } : {}}
                >
                    <RecentActorsIcon sx={{ fontSize: 20 }} className="text-slate-600" />
                </div>
            </Tooltip>
        
        </div>
    )
}
