import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter } from 'next-nprogress-bar';
import useAppStore from "@/store/appStore";

function UseShortcut(action, keys) {
    const router = useRouter();
    const { updateLeadFormOpen } = useAppStore();
    // useHotkeys('ctrl+L', () => {
    //     router.push("/scale/lead");
    //     setTimeout(() => {
    //         updateLeadFormOpen(true);
    //     }, 1000);
    // })
    // useHotkeys('ctrl+R+M', () => {
    //     router.push("/scale/reports/meeting");
    // })

    return <></>;
}
export default UseShortcut;