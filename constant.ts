export interface Employee {
    uniqueId: number;
    name: string;
    subordinates: Employee[];
}

export interface IEmployeeOrgApp {
    ceo: Employee;
    /**
    * Moves the employee with employeeID (uniqueId) under a supervisor
    (another employee) that has supervisorID (uniqueId).
    * E.g. move Bob (employeeID) to be subordinate of Georgina
    (supervisorID). * @param employeeID
    * @param supervisorID
    */
    move(employeeID: number, supervisorID: number): void;

    /** Undo last move action */
    undo(): void;

    /** Redo last undone action */
    redo(): void;
}

export const will: Employee = {
    uniqueId: 15,
    name: 'Will Turner',
    subordinates: []
}

export const tina: Employee = {
    uniqueId: 14,
    name: 'Tina Teff',
    subordinates: [will]
}

export const thomas: Employee = {
    uniqueId: 13,
    name: 'Thomas Brown',
    subordinates: []
}

export const bob: Employee = {
    uniqueId: 12,
    name: 'Bob Saget',
    subordinates: [tina]
}

export const marry: Employee = {
    uniqueId: 11,
    name: 'Mary Blue',
    subordinates: []
}

export const sophie: Employee = {
    uniqueId: 10,
    name: 'Sophie Turner',
    subordinates: []
}

export const gary: Employee = {
    uniqueId: 9,
    name: 'Gary Styles',
    subordinates: []
}

export const george: Employee = {
    uniqueId: 8,
    name: 'George Carrey',
    subordinates: []
}

export const harry: Employee = {
    uniqueId: 7,
    name: 'Harry Tobs',
    subordinates: [thomas]
}

export const cassandra: Employee = {
    uniqueId: 6,
    name: 'Cassandra Reynolds',
    subordinates: [marry, bob]
}

export const georgina: Employee = {
    uniqueId: 5,
    name: 'Georgina Flangy',
    subordinates: [sophie]
};

export const bruce: Employee = {
    uniqueId: 4,
    name: 'Bruce Willis',
    subordinates: []
};

export const tyler: Employee = {
    uniqueId: 3,
    name: 'Tyler Simpson',
    subordinates: [harry, george, gary]
};

export const sarah: Employee = {
    uniqueId: 2,
    name: 'Sarah Donald',
    subordinates: [cassandra]
};

export const ceo: Employee = {
    uniqueId: 1,
    name: 'Mark Zuckerberg',
    subordinates: [sarah, tyler, bruce, georgina]
};
