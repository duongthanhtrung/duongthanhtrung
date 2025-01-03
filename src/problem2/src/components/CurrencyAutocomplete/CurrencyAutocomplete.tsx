import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import {
  HelpTextProps,
  Key,
  TextInputBase,
  Validation,
} from "@react-types/shared";
import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface CurrencyAutocompleteProps
  extends HelpTextProps,
    Validation,
    TextInputBase {
  label: string;
  name?: string;
  isDisabled?: boolean;
  value: string;
  onSelectionChange: (key: Key | null) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  data: { currency: string }[];
}

const CurrencyAutocomplete: React.FC<CurrencyAutocompleteProps> = ({
  label,
  name,
  isDisabled,
  value: externalValue,
  placeholder,
  isInvalid,
  errorMessage,
  onSelectionChange,
  onBlur,
  data,
}) => {
  const [internalValue, setInternalValue] = useState<string>(externalValue);
  const changeFlag = useRef(false);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    setInternalValue(externalValue);
  }, [externalValue]);

  const isValidCurrency = useCallback(
    (currency: string) => data.some((item) => item.currency === currency),
    [data]
  );

  const handleInputChange = useCallback(
    (newValue: string) => {
      if (changeFlag.current) {
        setInternalValue(newValue);
        if (isValidCurrency(newValue)) {
          changeFlag.current = false;
        }
      }
    },
    [isValidCurrency]
  );

  const handleKeyDown = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    changeFlag.current = true;
  }, []);

  const handleKeyUp = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      changeFlag.current = false;
    }, 300);
  }, []);

  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (isValidCurrency(internalValue) && internalValue !== externalValue) {
        onSelectionChange(internalValue);
      } else {
        setInternalValue(externalValue); // Reset to external value if invalid
      }
      onBlur?.(e);
    },
    [externalValue, internalValue, isValidCurrency, onBlur, onSelectionChange]
  );

  return (
    <Autocomplete
      className="w-full"
      label={label}
      name={name}
      isDisabled={isDisabled}
      isClearable={false}
      labelPlacement="inside"
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      inputValue={internalValue}
      defaultSelectedKey={internalValue}
      onSelectionChange={onSelectionChange}
      errorMessage={errorMessage ?? ""}
      isInvalid={isInvalid}
      placeholder={placeholder}
      onInputChange={handleInputChange}
      startContent={
        isValidCurrency(internalValue) ? (
          <Image
            alt={internalValue}
            className="w-6 h-6"
            src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${internalValue}.svg`}
          />
        ) : undefined
      }
      radius="sm"
    >
      {data.map((price) => (
        <AutocompleteItem
          key={price.currency}
          startContent={
            <Image
              alt={price.currency}
              className="w-6 h-6"
              src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${price.currency}.svg`}
            />
          }
        >
          {price.currency}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default memo(CurrencyAutocomplete);
