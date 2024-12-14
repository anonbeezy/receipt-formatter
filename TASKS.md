# Roadmap

- [ ] If category cannot be matched then ask the user for input
- [ ] Use extracted line items to match a category

# Tech Excellence

- [x] Create payee transform test to verify ChatGPT input/output.
- [x] Payees: Refactor nodes to inherit from Runnable
- [x] Payees: Combine transform and format nodes into a single node
- [ ] Categories: Refactor nodes to inherit from Runnable
- [ ] Categories: Combine transform and format nodes into a single node

# Bugs

- [ ] The transfer amount is positive so YNAB thinks it's income
- [x] The matched payee is incorrect when the name does not match exactly
