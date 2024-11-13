"use client";
import { useState, useEffect } from 'react';

const SpecialModuleSwitch = ({ handleSpecialSwitch, expertMode, rowModules }) => {
    const modules = [
        // "Pages",
        "Retrospectives",
        // "Import",
        // "Timer",
        // "Project To Do",
        // "Bookmarks",
        // "Whiteboard"
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
        handleSpecialSwitch(newModules);
    };

    const moduleIntros = {
        "Pages": "The Pages module allows you to create and manage various project pages, providing a structured approach to organizing project information.",
        "Retrospectives": "The Retrospectives module facilitates the review of past work and team performance, enabling continuous improvement through feedback and reflection.",
        "Import": "The Import module enables the integration of external data and resources into your project, streamlining workflows and consolidating information.",
        "Timer": "The Timer module provides tools for tracking time spent on tasks, helping manage project timelines and improve productivity.",
        "Project To Do": "The Project To-Do module helps manage and prioritize tasks within a project, ensuring that key activities are completed efficiently.",
        "Bookmarks": "The Bookmarks module allows you to save and organize important links and resources, making it easier to access frequently used information.",
        "Whiteboard": "The Whiteboard module provides a virtual space for brainstorming and visual collaboration, allowing teams to map out ideas and strategies."
    };

    useEffect(() => {
        // console.log('rowModules ', rowModules);
        if (rowModules === undefined) {
            if (expertMode) {
                // Set all modules to active if expertMode is true
                setActiveModules(modules.map(module => ({ name: module, active: true })));
                handleSpecialSwitch(modules.map(module => ({ name: module, active: true })));
            } else {
                // Optionally reset the modules' active states based on rowModules
                setActiveModules(modules.map(module => ({ name: module, active: false })));
                handleSpecialSwitch(modules.map(module => ({ name: module, active: false })));
            }
        } else {
            setActiveModules(initializeActiveModules(modules, rowModules));
            handleSpecialSwitch(initializeActiveModules(modules, rowModules));
        }

    }, [expertMode, rowModules]);

    return (
        <div className="max-w-[550px] min-w-[550px] mt-16">
            <h2 className="text-lg font-semibold mb-4">Select Feature</h2>
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

export default SpecialModuleSwitch;
