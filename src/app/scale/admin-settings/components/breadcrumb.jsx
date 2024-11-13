import { useRouter } from 'next-nprogress-bar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Breadcrumb({ page }) {
    const router = useRouter();

    return (
        <div style={{ minWidth: '100%', maxWidth: '100%' }} className="my-3 mb-3">
            <div className="max-h-[50px] -mt-2">
                <div className="flex">
                    <div className="mt-1 text-sm font-semibold text-blue-600 cursor-pointer underline" onClick={() => {
                        router.push("/scale/admin-settings");
                    }}>
                        Admin Settings
                    </div>
                    <div className="mx-2">
                        <ArrowForwardIosIcon fontSize="10px" />
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                        {page}
                    </div>
                </div>

            </div>
        </div>
    )
}
