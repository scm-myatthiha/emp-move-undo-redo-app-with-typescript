import { Employee, IEmployeeOrgApp, ceo, bob, georgina } from "./constant";
class EmployeeOrgApp implements IEmployeeOrgApp {
    ceo: Employee;
    private previousActions: {
        move: { employeeID: number, supervisorID: number }, undo: {
            subordinates: Employee[]; employeeID: number, supervisorID: number
        }
    }[] = [];
    private currentActionIndex = -1;

    constructor(ceo: Employee) {
        this.ceo = ceo;
    }

    public findEmployee(employeeID: number, currentEmployee: Employee): Employee | null {
        // Return current employee if ids are equal
        if (currentEmployee.uniqueId === employeeID) {
            return currentEmployee;
        }

        // Recursively search for employee in the subordinates of current employee
        for (const subordinate of currentEmployee.subordinates) {
            const subEmployee = this.findEmployee(employeeID, subordinate);
            if (subEmployee) {
                return subEmployee;
            }
        }

        // Return null if employee is not found in the subordinates of the current employee
        return null;
    }

    public findSupervisor(employee: Employee, currentEmployee: Employee): Employee | null {
        // Return current employee if employee is found in the list of subordinates
        if (currentEmployee.subordinates.includes(employee)) {
            return currentEmployee;
        }

        // Return employee if it is the CEO
        if (employee === this.ceo) {
            return employee;
        }

        // Recursively search for supervisor in the subordinates of current employee
        for (const subordinate of currentEmployee.subordinates) {
            const supervisor = this.findSupervisor(employee, subordinate);
            if (supervisor) {
                return supervisor;
            }
        }

        // Return null if the employee is not found in the subordinates of the current employee
        return null;
    }

    move(employeeID: number, supervisorID: number): void {
        // Find employee with the given employeeID
        const employee = this.findEmployee(employeeID, this.ceo);
        if (!employee) {
            throw new Error(`Employee with ID ${employeeID} not found.`);
        }

        // Find supervisor with the given supervisorID
        const supervisor = this.findEmployee(supervisorID, this.ceo);
        if (!supervisor) {
            throw new Error(`Supervisor with ID ${supervisorID} not found.`);
        }

        // Find current supervisor of the employee
        const currentSupervisor = this.findSupervisor(employee, this.ceo);
        if (!currentSupervisor) {
            throw new Error(`Current supervisor of employee with ID ${employeeID} not found.`);
        }

        // Remove employee from the list of subordinates of their current supervisor
        currentSupervisor.subordinates = currentSupervisor.subordinates.filter(e => e.uniqueId !== employee.uniqueId);

        // Move employee's subordinate to current supervisor subordinates
        currentSupervisor.subordinates = [...currentSupervisor.subordinates, ...employee.subordinates];
        const tempSubordinates = [...employee.subordinates];

        // Remove employee's subordinate
        employee.subordinates = [];

        // Add employee to the list of subordinates of the new supervisor
        supervisor.subordinates.push(employee);

        // Store the employee's previous supervisor and subordinates
        const undoAction = {
            employeeID: employee.uniqueId,
            supervisorID: currentSupervisor.uniqueId,
            subordinates: tempSubordinates
        };

        this.previousActions.push({ move: { employeeID, supervisorID }, undo: undoAction });
        this.currentActionIndex++;
    }

    undo(): void {
        // Check if there are some actions to undo
        if (this.currentActionIndex < 0) {
            throw new Error('There is no action to undo.');
        }

        // Get current action and the previous action
        const currentAction = this.previousActions[this.currentActionIndex];

        // Check if current action is a move action
        if (currentAction.move) {
            // Find employee and supervisor of the current action
            const employee = this.findEmployee(currentAction.move.employeeID, this.ceo);
            if (!employee) {
                throw new Error(`Employee with ID ${currentAction.move.employeeID} not found.`);
            }
            const supervisor = this.findEmployee(currentAction.move.supervisorID, this.ceo);
            if (!supervisor) {
                throw new Error(`Supervisor with ID ${currentAction.move.supervisorID} not found.`);
            }
            // Remove employee from the list of subordinates of their current supervisor
            supervisor.subordinates = supervisor.subordinates.filter(e => e.uniqueId !== employee.uniqueId);

            // Add employee to the list of subordinates of their previous supervisor
            const previousSupervisor = this.findEmployee(currentAction.undo.supervisorID, this.ceo);
            if (!previousSupervisor) {
                throw new Error(`Supervisor with ID ${currentAction.undo.supervisorID} not found.`);
            }
            previousSupervisor.subordinates.push(employee);

            // Restore the employee's previous subordinates
            employee.subordinates = currentAction.undo.subordinates;

            const removeEmployee = (employeeID: number, subordinates: Employee[]): Employee[] => {
                return subordinates.filter(employee => employee.uniqueId !== employeeID);
            }

            // Remove employee's subordinate include in employee's supervisor's subordinates
            employee.subordinates.map(sub => {
                previousSupervisor.subordinates = removeEmployee(sub.uniqueId, previousSupervisor.subordinates);
            });

        }

        // Update current action index
        this.currentActionIndex--;
    }

    redo(): void {
        // Check if there are any actions to redo
        if (this.currentActionIndex >= this.previousActions.length - 1) {
            return;
        }

        // Retrieve next move action
        const { move } = this.previousActions[this.currentActionIndex + 1];
        const { employeeID, supervisorID } = move;

        // Find employee and the supervisor involved in the move action
        const employee = this.findEmployee(employeeID, this.ceo);
        if (!employee) {
            throw new Error(`Employee with ID ${employeeID} not found.`);
        }

        const supervisor = this.findEmployee(supervisorID, this.ceo);

        if (!supervisor) {
            throw new Error(`Supervisor with ID ${supervisorID} not found.`);
        }

        // Remove employee from the list of subordinates of their current supervisor
        const currentSupervisor = this.findSupervisor(employee, this.ceo);
        if (!currentSupervisor) {
            throw new Error(`Supervisor with ID ${supervisorID} not found.`);
        }
        currentSupervisor.subordinates = currentSupervisor.subordinates.filter(e => e.uniqueId !== employee.uniqueId);

        // Move employee's subordinate to current supervisor subordinates
        currentSupervisor.subordinates = [...currentSupervisor.subordinates, ...employee.subordinates];
        employee.subordinates = [];

        // Add employee to the list of subordinates of the new supervisor
        supervisor.subordinates.push(employee);

        // Increment current action index
        this.currentActionIndex++;
    }
}

// Create a new instance of the EmployeeOrgApp class with the CEO
const app = new EmployeeOrgApp(ceo);
app.move(bob.uniqueId, georgina.uniqueId);
app.undo();
app.redo();
