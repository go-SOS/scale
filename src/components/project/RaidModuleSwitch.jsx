"use client";
import { useState, useEffect } from 'react';

const RaidModuleSwitch = ({ handleRaidSwitch, expertMode, rowModules }) => {
    const modules = [
        "Risk",
        "Assumptions",
        "Issues",
        "Dependencies"
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
        handleRaidSwitch(newModules);
    };

    const moduleIntros = {
        "Risk": "The Risk Log module helps track and manage potential risks to the project, ensuring proactive measures and mitigation strategies.",
        "Assumptions": "The Assumptions Log records assumptions made during project planning and execution, providing a reference for future decisions and adjustments.",
        "Issues": "The Issues Log module tracks and resolves problems that arise during the project, ensuring timely resolution and minimizing impact on project goals.",
        "Dependencies": "The Dependencies Log tracks dependencies between tasks or projects, helping to manage interdependencies and ensure timely completion of deliverables."
    };

    useEffect(() => {
        // console.log('rowModules ', rowModules);
        if (rowModules === undefined) {
            if (expertMode) {
                // Set all modules to active if expertMode is true
                setActiveModules(modules.map(module => ({ name: module, active: true })));
                handleRaidSwitch(modules.map(module => ({ name: module, active: true })));
            } else {
                // Optionally reset the modules' active states based on rowModules
                setActiveModules(modules.map(module => ({ name: module, active: false })));
                handleRaidSwitch(modules.map(module => ({ name: module, active: false })));
            }
        } else {
            setActiveModules(initializeActiveModules(modules, rowModules));
            handleRaidSwitch(initializeActiveModules(modules, rowModules));
        }

    }, [expertMode, rowModules]);

    return (
        <div className="max-w-[550px] min-w-[550px] mt-16">
            <h2 className="text-lg font-semibold mb-4">Select RAID Features</h2>
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

export default RaidModuleSwitch;
