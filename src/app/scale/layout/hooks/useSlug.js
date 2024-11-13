"use client";
import { useState, useEffect } from "react";
import useAppStore from '@/store/appStore';

const useSlug = () => {
    const { currentProject } = useAppStore();
    const [projectDetails, setProjectDetails] = useState({ projectName: currentProject?.projectName, slug: currentProject?.projectSlug, key: currentProject?.projectKey });

    useEffect(() => {
        if (currentProject) {
            const slug = currentProject.projectSlug;
            const projectName = currentProject.projectName;
            const key = currentProject.projectKey;
            setProjectDetails({ projectName, slug, key });
        }
    }, [currentProject]);

    return projectDetails;
};

export default useSlug;
