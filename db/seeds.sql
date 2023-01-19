INSERT INTO department (departmentName)
VALUES
(`Team Durant Players`),  -- 1
(`Team Lebron Players`),  -- 2
(`Team Durant Coaches`),  -- 3
(`Team Lebron Coaches`);  -- 4

INSERT INTO role (id, title, salary, departmentId)
VALUES
    (1, `Team Durant Guard`, 6000000, 1),
    (2, `Team Lebron Guard`, 6000000, 2),
    (3, `Team Durant Forward`, 7000000, 1),
    (4, `Team Lebron Forward`, 7000000, 2),
    (5, `Team Durant Center`, 5000000, 1),
    (6, `Team Lebron Center`, 5000000, 2),
    (7, `Team Durant Captain`, 350000, 3),
    (8, `Team Lebron Captain`, 350000, 4),
    (9, `Team Durant Head Coach`, 2000000, 3),
    (10, `Team Lebron Head Coach`, 2000000, 4);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (`Kevin`,`Durant`,7,9),
    (`Joel`,`Embiid`,5,7),
    (`Ja`,`Morant`,1,7),
    (`Jayson`,`Tatum`,3,7),
    (`Andrew`,`Wiggins`,3,7),
    (`Trae`,`Young`,1,7),
    (`LaMelo`,`Ball`,1,7),
    (`Devin`,`Booker`,1,7),
    (`Rudy`,`Gobert`,5,7),
    (`Zach`,`LaVine`,1,7),
    (`Khris`,`Middleton`,2,7),
    (`Dejounte`,`Murray`,1,7),
    (`Karl-Anthony`,`Towns`,5,7),
    (`Draymond`,`Green`,3,7),
    (`Erik`,`Spoelstra`,9,null),
    (`Lebron`,`James`,8,10),
    (`Giannis`,`Antetokounmpo`,4,8),
    (`Stephen`,`Curry`,2,8),
    (`DeMar`,`DeRozan`,2,8),
    (`Nikola`,`Jokic`,6,8),
    (`Jarrett`,`Allen`,6,8),
    (`Jimmy`,`Butler`,4,8),
    (`Luka`,`Doncic`,4,8),
    (`Darius`,`Garland`,2,8),
    (`James`,`Harden`,2,8),
    (`Donovan`,`Mitchell`,2,8),
    (`Chris`,`Paul`,2,8),
    (`Fred`,`VanVleet`,2,8),
    (`Monty`,`Williams`,10,null);

