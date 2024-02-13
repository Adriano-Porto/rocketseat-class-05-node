
export abstract class ValueObject <Props> {

    protected props: Props // Can be accessed by classes that extend this class


    protected constructor(props: Props) {
        this.props = props
    }

    public equals(valueObject: ValueObject<any>) {
        if (valueObject === null || valueObject === undefined) {
            return false
        }

        if (valueObject.props === undefined) {
            return false
        }

        return JSON.stringify(valueObject.props) === JSON.stringify(this.props)
    }
}