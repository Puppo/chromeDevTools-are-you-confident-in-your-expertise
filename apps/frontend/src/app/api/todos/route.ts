import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In a real app, this would be a database
const todos = [
  { id: '1', text: 'Open Chrome DevTools (F12)', completed: false, createdAt: new Date().toISOString() },
  { id: '2', text: 'Go to Network tab', completed: false, createdAt: new Date().toISOString() },
  { id: '3', text: 'Monitor API requests in real-time', completed: false, createdAt: new Date().toISOString() },
  { id: '4', text: 'Check Performance tab for metrics', completed: false, createdAt: new Date().toISOString() },
  { id: '5', text: 'Use Console for debugging', completed: false, createdAt: new Date().toISOString() },
];

export async function GET() {
  // Simulate network delay to see in DevTools
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({ 
    todos,
    timestamp: new Date().toISOString(),
    message: 'Todos fetched successfully'
  });
}

export async function POST(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Todo text is required' },
        { status: 400 }
      );
    }

    const newTodo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    todos.push(newTodo);

    return NextResponse.json({
      todo: newTodo,
      message: 'Todo created successfully'
    }, { status: 201 });

  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const body = await request.json();
    const { id, text, completed } = body;

    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    // Update the todo
    if (text !== undefined) {
      todos[todoIndex].text = text;
    }
    if (completed !== undefined) {
      todos[todoIndex].completed = completed;
    }

    return NextResponse.json({
      todo: todos[todoIndex],
      message: 'Todo updated successfully'
    });

  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }

    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];

    return NextResponse.json({
      todo: deletedTodo,
      message: 'Todo deleted successfully'
    });

  } catch {
    return NextResponse.json(
      { error: 'Error deleting todo' },
      { status: 500 }
    );
  }
}