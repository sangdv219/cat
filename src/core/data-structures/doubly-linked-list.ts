export class DoubleNode<T> {
    data: T;
    next: DoubleNode<T> | null = null;
    prev: DoubleNode<T> | null = null;

    constructor(data: T) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

export class DoublyLinkedList<T> {
    private head: DoubleNode<T> | null = null;
    private tail: DoubleNode<T> | null = null;
    private size: number = 0;

    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    append(data: T): void {
        const newNode = new DoubleNode(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            this.tail!.next = newNode;
            this.tail = newNode;
        }
        this.size++;    
    }

    prepend(data: T): void {
        const newNode = new DoubleNode(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.prev = newNode;
            this.head = newNode;
        }
        this.size++;
    }

    getSize(): number {
        return this.size;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    getHead(): DoubleNode<T> | null {
        return this.head;
    }

    getTail(): DoubleNode<T> | null {
        return this.tail;
    }

    display(): void {
        let current = this.head;
        const elements: T[] = [];
        while (current) {
            elements.push(current.data);
            current = current.next;
        }
        console.log(elements.join(' <-> '));
    }
}