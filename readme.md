# 99Tech Code Challenge

This repository contains my solutions for the 99Tech Code Challenge as part of the interview process.

## About Me ##
- **Position Applied:** Front-End Developer
- **Problems Attempted:**
    - **Problem 1:** Three ways to sum to `n`
    - **Problem 2:** Fancy Form
    - **Problem 3:** Messy React

I have focused on demonstrating my skills in front-end development by tackling the above problems. If you have any questions, feel free to reach out.

## Problem 1: Assumptions and Input Validation ##
For **Problem 1**, I have added validation to ensure the input is a positive integer greater than 0. This is to handle potential edge cases where a non-positive integer could cause issues in the summation process. Although the problem specifies that the input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`, I’ve included this validation to safeguard against unexpected inputs and ensure correct functionality in a broader context.

## Problem 3: Identifying Computational Inefficiencies and Anti-Patterns ##

In reviewing the provided code for **Problem 3**, I identified several areas for improvement. Here's a detailed breakdown of the issues and how I refactored the code for better performance:

1. **Inefficient `useMemo` Hook Usage**:
    - **Issue**: The `useMemo` hook was used to optimize expensive computations, but it recalculated `sortedBalances` every time `balances` or `prices` changed. The `prices` array was not actually used in the computation of `sortedBalances`, which led to unnecessary recomputations.
    - **Improvement**: Removed `prices` from the dependencies of `useMemo` since it wasn't required for the computation, improving performance by avoiding unnecessary recalculations when `prices` changed.

2. **Inefficient Filtering Logic**:
    - **Issue**: The `filter` method was iterating over `balances` and calling the `getPriority` function inside the loop. This resulted in an additional iteration over the `balances` array and an unnecessary recalculation of priority for each balance.
    - **Improvement**: I combined filtering and mapping logic by using a `map` operation to attach the priority once and then filter balances based on valid conditions in a single pass. This reduces unnecessary iterations and improves readability.

3. **Inefficient Sorting**:
    - **Issue**: The sorting operation was performed after filtering, using the `getPriority` function multiple times for each comparison. This redundant function call slowed down the sorting process.
    - **Improvement**: I calculated `priority` values once for each `balance` and stored them before sorting. This ensures that the `getPriority` function is not called repeatedly during sorting, leading to better performance.

4. **Mapping `sortedBalances` Multiple Times**:
    - **Issue**: `sortedBalances` was being mapped twice: once for generating `formattedBalances` and again for generating `rows`. This caused redundant iterations over the array.
    - **Improvement**: I combined these mapping operations into a single loop, eliminating the extra iteration and improving efficiency.

5. **Unnecessary Type Casting**:
    - **Issue**: The `getPriority` function used `any` type for the `blockchain` argument, which could lead to runtime errors and unpredictable behavior.
    - **Improvement**: I replaced the `any` type with a more specific `Blockchain` enum type, which ensures better type safety and reduces the risk of errors during execution.

6. **Inefficient `lhsPriority` Usage**:
    - **Issue**: The variable `lhsPriority` is used in the original code but isn't defined anywhere, causing potential errors and confusion. It was unclear where this variable came from or how it should be calculated.
    - **Improvement**: Removed the reference to `lhsPriority`, as it wasn't clearly defined. Instead, the code uses the priority value of each balance directly, obtained by calling `getPriority(balance.blockchain)`.

## Submission ##
You can view my solutions in this repository. The problems I have not attempted (Problem 4 and Problem 5) are left as placeholders to maintain the structure of the repo.

Thank you for reviewing my submission!
