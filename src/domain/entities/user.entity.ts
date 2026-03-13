export class User {
    private constructor(
      public readonly id: string,
      public email: string,
      private passwordHash: string,
      public readonly createdAt: Date,
    ) {}
  
    static create(props: { id: string; email: string; passwordHash: string }) {
      if (!props.email.includes('@')) throw new Error('Invalid email')
      return new User(props.id, props.email, props.passwordHash, new Date())
    }
  
    changeEmail(newEmail: string) {
      if (!newEmail.includes('@')) throw new Error('Invalid email')
      this.email = newEmail
    }
  
    getPasswordHash() {
      return this.passwordHash
    }
  }