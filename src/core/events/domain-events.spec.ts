import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'
import { vi} from 'vitest'

class CustomAggregateCreated implements DomainEvent {
    public ocurredAt: Date
    private aggregate: CustomAggregate

    constructor(aggregate: CustomAggregate) {
        this.aggregate = aggregate
        this.ocurredAt = new Date()
    }


    public getAggregateId(): UniqueEntityID {
        return this.aggregate.id
    }
}

class CustomAggregate extends AggregateRoot<null> {
    static create() {
        const aggregate = new CustomAggregate(null)
        
        aggregate.addDomainEvent(new CustomAggregateCreated(aggregate)) // Create a event

        return aggregate
    }
}

describe('Domain Events', () => {
    it('should be able to dispatch and listen to events', () => {
        const callbcakSpy = vi.fn()


        //Subscribe callbackSpy
        DomainEvents.register(callbcakSpy, CustomAggregateCreated.name) //* Get the class name */) 
      
        // Create a message
        const aggregate = CustomAggregate.create()

        // Surely the message was created
        expect(aggregate.domainEvents).toHaveLength(1)
        
        // The message was dispatched
        DomainEvents.dispatchEventsForAggregate(aggregate.id) // Envia o evento
        
        // The Subscribed has been called
        expect(callbcakSpy).toHaveBeenCalledOnce()
        
        // Ensures the message was dispatched and removed from non-dispatched arrays
        expect(aggregate.domainEvents).toHaveLength(0)

    })
})