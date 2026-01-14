export class Node<T> {
    data: T;
    next: Node<T> | null = null;

    constructor(data: T) {
        this.data = data;
        this.next = null;
    }
}

export class SinglyLinkedList<T> {
    private head: Node<T> | null = null;
    private tail: Node<T> | null = null;
    private size: number = 0;

    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    append(data: T): void {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail!.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    }

    prepend(data: T): void {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
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

    getHead(): Node<T> | null {
        return this.head;
    }

    getTail(): Node<T> | null {
        return this.tail;
    }

    display(): void {
        let current = this.head;
        let result = "";

        while (current !== null) {
            result += `${current.data} -> `;
            current = current.next;
        }

        console.log(result + "null");
    }
}