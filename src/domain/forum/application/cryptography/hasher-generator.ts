export abstract class HashGenerator {
    abstract hash(plain: string): Promise< string>
}

// Single Responsibility
// Open Closed principal
// Liskov Substitution
// Interface Segregation
// Depedency Inversion