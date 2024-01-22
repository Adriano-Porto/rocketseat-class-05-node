import { Either, left, right } from './either'

function doSomething(x:boolean): Either<string, number>{
    if (x) return right(10)
    return left('error')
}

test('success result', () => {
    const successResult = doSomething(true)

    expect(successResult.isRight()).toBe(true)
})

test('failure result', () => {
    const failureResult = doSomething(false)

    expect(failureResult.isLeft()).toBe(true)
})