"use client";
import { useState, useEffect } from 'react';

const PlanningModuleSwitch = ({ handlePlanningSwitch, expertMode, rowModules }) => {
    const modules = [
        "TeamCharter",
        "Plan",
        "Backlog",
        "Sprints",
        "Releases",
        // "Calendar"
    ];

    const initializeActiveModules = (modules, rowModules) => {
        if (rowModules !== undefined) {
            return modules.map(module => ({ name: module, active: !!rowModules[module] }));
        }
    };

    const [activeModules, setActiveModules] = useState(modules.map(module => ({ name: module, active: false })));

    const toggleModule = (index) => {
        const newModules = [...activeModules];
        newModules[index].active = !newModules[index].active;
        setActiveModules(newModules);
        handlePlanningSwitch(newModules);
    };

    const moduleIntros = {
        "TeamCharter": "The Team Charter defines the team's mission, objectives, roles, and responsibilities, ensuring alignment and clear direction.",
        "Plan": "The Plan module helps outline project goals, strategies, and tasks, providing a roadmap for successful project execution.",
        "Backlog": "The Backlog module prioritizes and organizes tasks and features, ensuring the most important work is completed first.",
        "Sprints": "A sprint is a defined period within Agile methodology where specific tasks are completed and reviewed, enabling incremental progress and regular feedback.",
        "Releases": "The Releases module manages the deployment of completed work, ensuring timely and organized delivery of project increments.",
        "Calendar": "The Calendar module schedules and tracks important dates, meetings, and deadlines, keeping the team on track and organized."
    };

    useEffect(() => {
        // console.log('rowModules ', rowModules);
        if (rowModules === undefined) {
            // console.log('rowModules ', rowModules);
            if (expertMode) {
                // Set all modules to active if expertMode is true
                setActiveModules(modules.map(module => ({ name: module, active: true })));
                handlePlanningSwitch(modules.map(module => ({ name: module, active: true })));
            } else {
                // Optionally reset the modules' active states based on rowModules
                setActiveModules(modules.map(module => ({ name: module, active: false })));
                handlePlanningSwitch(modules.map(module => ({ name: module, active: false })));
            }
        } else {
            setActiveModules(initializeActiveModules(modules, rowModules));
            handlePlanningSwitch(initializeActiveModules(modules, rowModules));
        }

    }, [expertMode, rowModules]);

    return (
        <div className="max-w-[550px] min-w-[550px] mt-10">
            <h2 className="text-lg font-semibold mb-4">Select Planning Features</h2>
            <div className="space-y-4">
                {activeModules && activeModules.map((module, index) => (
                    <div key={index}>
                        <hr />
                        <div className="flex items-center justify-between pt-5 pb-2">
                            <span>{module.name}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={module.active}
                                    onChange={() => toggleModule(index)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="text-[12px] max-w-[480px] mt-2">
                            {moduleIntros[module.name]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlanningModuleSwitch;
