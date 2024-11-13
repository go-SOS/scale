import { useRouter } from 'next-nprogress-bar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Breadcrumb({ page, project, section, slug }) {
    const router = useRouter();

    const goToLink = () => {
        // console.log('Section ', section);
        // if (slug && section === "Team") {
        //     router.push("/scale/" + slug + "/team/team");
        // }
        if (section === "Pages") {
            router.push("/scale/" + slug + "/pages");
        }
    }

    return (
        <div style={{ minWidth: '100%', maxWidth: '100%' }} className="my-3 mb-3">
            <div className="max-h-[50px] -mt-2">
                <div className="flex">
                    {project && (
                        <div className="flex">
                            <div className="mt-1 text-sm font-semibold underline">
                                {project}
                            </div>
                            <div className="mx-2">
                                <ArrowForwardIosIcon fontSize="10px" />
                            </div>
                        </div>
                    )}
                    {section && (
                        <div className="flex">
                            <div className="mt-1 text-sm font-semibold underline cursor-pointer"
                                onClick={() => {
                                    goToLink()
                                }}
                            >
                                {section}
                            </div>
                            <div className="mx-2">
                                <ArrowForwardIosIcon fontSize="10px" />
                            </div>
                        </div>
                    )}
                    <div className="mt-1 text-sm font-semibold underline">
                        {page}
                    </div>
                </div>
            </div>
        </div>
    )
}
