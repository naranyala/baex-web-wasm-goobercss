export interface MenuItem {
  label: string;
  description: string;
  module: string;
  function: string;
  args: any[];
}

export const MENU_ITEMS: MenuItem[] = [
  { label: 'Add', description: 'Adds two numbers', module: 'math', function: 'add', args: [10, 5] },
  { label: 'Subtract', description: 'Subtracts two numbers', module: 'math', function: 'subtract', args: [10, 5] },
  { label: 'Multiply', description: 'Multiplies two numbers', module: 'math', function: 'multiply', args: [10, 5] },
  { label: 'Is Even', description: 'Checks if number is even', module: 'logic', function: 'is_even', args: [10] },
  { label: 'Is Positive', description: 'Checks if number is positive', module: 'logic', function: 'is_positive', args: [10] },
  { label: 'Browser Log', description: 'Send a message to JS console', module: 'browser_ext', function: 'log_hello', args: [] },
  { label: 'Browser Alert', description: 'Trigger a JS alert box', module: 'browser_ext', function: 'trigger_alert', args: [] },
  { label: 'Update Title', description: 'Change the document title', module: 'browser_ext', function: 'update_page_title', args: [] },
];

export function fuzzySearch(query: string, items: MenuItem[]) {
  const q = query.toLowerCase();
  return items.filter(item => 
    item.label.toLowerCase().includes(q) || 
    item.description.toLowerCase().includes(q)
  );
}
