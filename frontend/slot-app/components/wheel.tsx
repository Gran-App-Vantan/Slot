'use client';

import { role } from "./role/get-role";
import { useState } from "react";

interface wheelProps {
    execution: (result: string) => void;
}

export default function Wheel( { execution }: wheelProps ) {
    const [isRunning, setIsRunning] = useState(false);

    if (isRunning) {
        setIsRunning(false);
        execution(role);

        intervalRole.count 
    }
}