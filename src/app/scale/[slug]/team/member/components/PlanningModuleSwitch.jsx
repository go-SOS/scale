"use client";
import { useState, useEffect } from 'react';

const PlanningModuleSwitch = ({ handleProjectSelection, projectList, selectedProjects }) => {
    const [activeProjects, setActiveProjects] = useState([]);

    useEffect(() => {
        // console.log('selectedProjects ', selectedProjects);

        const initialProjects = projectList.map((project) => {
            const isSelected = selectedProjects.some(
                selected => selected.slug === project.projectSlug
            );
            return {
                name: project.projectName,
                slug: project.projectSlug,
                active: isSelected
            };
        });

        setActiveProjects(initialProjects);
    }, [projectList, selectedProjects]);

    // Toggle the active state of a project
    const toggleProject = (index) => {
        const updatedProjects = [...activeProjects];
        updatedProjects[index].active = !updatedProjects[index].active;
        setActiveProjects(updatedProjects);

        // Pass active projects (those toggled 'on') to the parent
        const selectedProjects = updatedProjects.filter(project => project.active);
        handleProjectSelection(selectedProjects);
    };

    return (
        <div className="max-w-[550px] min-w-[550px] mt-10">
            <div className="w-full bg-blue-100 text-black py-2 px-4 top-0 left-0 flex justify-center items-center relative mb-7 rounded-md">
                <div className="flex-grow text-center">
                    <p className="text-sm md:text-base mx-6">
                        Please ask the member to sign out and log back in to view the updated project allocation.
                    </p>
                </div>
            </div>
            <h2 className="text-lg font-semibold mb-4">Select Active Projects</h2>
            <div className="space-y-4">
                {activeProjects.map((project, index) => (
                    <div key={index}>
                        <hr />
                        <div className="flex items-center justify-between pt-5 pb-2">
                            <span>{project.name}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={project.active}
                                    onChange={() => toggleProject(index)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlanningModuleSwitch;
