# Project Rules & Expectations

This document outlines the strict rules and expectations for the project. These rules **must always be followed without exception**.

## 1. Core Languages
- **Backend & Scripts**: Build in **Python**.
- **Frontend / GUI**: Use **TypeScript, JavaScript, React, or modern frontend frameworks** (aim for a modern app look & feel).

## 2. strict Logging Architecture
- **Locations**: All logs must be written to the **console** and to a file in the `.log` directory at the project root.
- **Categorization**: Each type of log (e.g., `GameMaster`, `Test`) must have its own dedicated subfolder within `.log`.
- **Naming Convention**: `[LogType]-MM-DD-YYYY--HH.log` (e.g., `GameMaster-02-21-2026--22.log`).
- **Rotation**: Logs must be rotated every couple of hours.
- **Compression**: Rotated logs must be compressed into a `.zip` file at the end of every day.

## 3. Testing Requirements
- **Framework**: Use `pytest`.
- **Location**: All tests must reside in a `.test` directory at the project root.
- **Structure**: The directory structure inside `.test` must mirror the main project's directory structure.
- **File Naming**: All test scripts must be named `test_*.py`.
- **Test Logging**: 
  - Tests must log their results to the console and to a file.
  - Test logs should live alongside the main logging system but be easily distinguishable.
  - Follow the exact same rotation and `.zip` compression system as general logging.

## 4. Commenting Standards
Comments must be consistent, readable, and parseable.
- **Docstrings**: Mandatory for all functions and classes.
- **Logic**: Use clear inline comments outlining flow and choices.
- **Tags & Formatting**:
  - `TODO:`, `FIXME:`, `HACK:`, `QUESTION:`, `NOTE:` prefixes.
  - `[ ]` - Used for trackable checklist items that will be parsed.
  - `!` - Used to mark critically important things.
  - `?` - Used to mark unresolved questions.
  - `*` - Used to mark standard notes.
- **Task Extraction**:
  - Comments with `[ ]` must be parsed every few hours and logged into a `.todo` directory.
  - Output files should be timestamped with accurate descriptors.
  - Completed items should be zipped and moved to `.todo/.done/`.

## 5. Architectural Consistency
Codebase architecture must remain consistent, easy to navigate, and loosely coupled.
- **Naming Conventions**: Use consistent naming for files, directories, classes, functions, variables, modules, and packages.
- **Separation of Concerns (SoC)**: Strictly respected across all systems.
  - **Frontend**: Exclusively for User Interaction.
  - **Backend**: Exclusively for Business Logic, API operations, and Database connections.
  - **Middleware**: For Validations, Authentication, Logging, Error Handling, Security, and cross-cutting concerns.
  - **Models**: Pydantic models, Schemas, and SQLAlchemy Database models.

## 6. GitHub / VCS Operations
- **Branching Policy**: **NEVER MERGE OR PUSH WORK DIRECTLY TO THE `main` OR `master` BRANCH.**
- **Code Reviews**: All un-merged PRs require a manual code review.
- Always remember to: **COMMIT**, **PUSH**, **TAG**, **BRANCH**, then **MERGE**.

## 7. Operational Directives
- **Documentation**: Maintain a `README.md` explaining directory usage and expectations.
- **Tasking**: Always create detailed, granular `TASK` artifacts for sprints.
- **Uncertainty**: *If in question, ASK.* Always prefer communication over assumptions.
