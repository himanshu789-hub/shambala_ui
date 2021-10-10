import { KeyboardEvent, useState, ChangeEvent, useEffect } from 'react';

type useCalcProps = {
    count: number;
    value: number;
};
const regexp: RegExp = /^[+]?(\d+(\.\d+)?)(([+-])?(\d+(\.\d+)?)?)+[+]?$/;
export function useCalc(props?: useCalcProps) {
    const [count, setCount] = useState<number>(
        props?.count || 0
    );
    const [value, setValue] = useState<string>(
        props?.value ? props.value + "" : "0"
    );
    const [error, setError] = useState<boolean>(false);
    useEffect(() => {
        if (props) {
            setCount(() => props.count);
            setValue(() => props.value + '');
        }
    }, [props?.count, props?.value])
    return {
        countProps: {
            value: count,
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                if (/\d+/.test(e.target.value))
                    setCount(() => Number.parseInt(e.target.value));
                if (e.target.value.length === 0) {
                    setCount(() => 0);
                }
            }
        },
        valueProps: {
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
                const {
                    target: { value }
                } = event;
                setValue(value);
                if (value.length === 0) { setCount(0); setValue(() => '0') };
            },
            onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter") {
                    if (regexp.test(value)) {
                        const arr = value.split(/[+-]/);
                        let sum = 0;
                        let cout = count;
                        if (count !== 0)
                            cout--;
                        for (var v of arr) {
                            if (v.length > 0 && v !== "0") {
                                cout++;
                                sum += Number.parseFloat(v);
                            }
                        }
                        setCount(() => cout);
                        setValue(sum + "");
                        setError(() => false);
                    } else
                        setError(() => true);
                }
                if (event.key === "Backspace") {
                    if (/^\d+(\.\d+)?$/.test(value)) {
                       setValue(()=>'0');
                       setCount(()=>0);
                    }
                }
            },
            value,
            error
        }
    };
}

export type useCalcReturn = ReturnType<typeof useCalc>;