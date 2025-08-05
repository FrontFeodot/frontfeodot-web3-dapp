import { isNonZero, isNumericString } from '@/lib/regex';
import { quoteExactOutput, quoteTokens } from '@/lib/web3/quoter';
import { swapTokenManager } from '@/lib/web3/swap';
import { SwapStatus } from '@/lib/web3/types/swap.types';
import { Token } from '@/lib/web3/types/token.types';
import { InputAdornment, OutlinedInputProps } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

type SwapField = 'amountIn' | 'amountOut';

interface UseInputConrtollProps {
  tokenIn: Token | null;
  tokenOut: Token | null;
}

const useInputConrtoll = ({ tokenIn, tokenOut }: UseInputConrtollProps) => {
  const [status, setStatus] = useState<SwapStatus>({
    message: '',
    type: 'info',
  });
  const [amountInString, setAmountInString] = useState('');
  const [amountOutString, setAmountOutString] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [activeField, setActiveField] = useState<SwapField>('amountIn');
  const quoteControllerRef = useRef<AbortController | null>(null);

  const isInput = activeField === 'amountIn';

  useEffect(() => {
    if (quoteControllerRef.current) {
      quoteControllerRef.current.abort();
    }

    const amountToParse = isInput ? amountInString : amountOutString;
    const fromToken = isInput ? tokenIn : tokenOut;
    const toToken = isInput ? tokenOut : tokenIn;

    if (!isNonZero(amountToParse) || !fromToken || !toToken) {
      setIsPending(false);
      if (isInput) {
        setAmountOutString('');
      } else {
        setAmountInString('');
      }
      return;
    }

    const controller = new AbortController();
    quoteControllerRef.current = controller;

    const amount = parseUnits(amountToParse, fromToken.decimals);

    const timeoutId = setTimeout(() => {
      controller.abort();
      setStatus({
        message: 'Network is busy, please try again later',
        type: 'error',
      });
      setIsPending(false);
    }, 60000);

    const getQuote = async () => {
      setIsPending(true);
      setStatus({ message: '', type: 'info' });

      const quotedAmount = isInput
        ? await quoteTokens({
            tokenIn: fromToken,
            tokenOut: toToken,
            amountIn: amount,
            signal: controller.signal,
          })
        : await quoteExactOutput({
            tokenIn: toToken,
            tokenOut: fromToken,
            amountOut: amount,
            signal: controller.signal,
          });

      if (controller.signal.aborted) return;

      if (quotedAmount) {
        const formattedAmount = formatUnits(quotedAmount, toToken.decimals);
        if (isInput) {
          setAmountOutString(formattedAmount);
        } else {
          setAmountInString(formattedAmount);
        }
        setStatus({ message: '', type: 'info' });
      } else {
        if (isInput) {
          setAmountOutString('');
        } else {
          setAmountInString('');
        }
        setStatus({
          message: 'No pools found, please change tokens or try later',
          type: 'error',
        });
      }

      setIsPending(false);
    };

    const debounceId = setTimeout(() => {
      getQuote().finally(() => clearTimeout(timeoutId));
    }, 1000);

    return () => {
      clearTimeout(debounceId);
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [amountInString, amountOutString, activeField, tokenIn, tokenOut]);

  const onAmountChange = async (amount: string, field: SwapField) => {
    if (!isNumericString(amount) && amount !== '') return;
    setIsPending(true);
    setActiveField(field);
    if (field === 'amountIn') {
      setAmountInString(amount);
    } else {
      setAmountOutString(amount);
    }
  };

  useEffect(() => {
    setAmountInString('');
    setAmountOutString('');
  }, [tokenIn, tokenOut]);

  const handleSwap = async () => {
    setStatus({ message: 'Preparing swap...', type: 'info' });
    if (!tokenIn || !tokenOut) return;
    await swapTokenManager(
      {
        tokenIn,
        tokenOut,
        amountIn: parseUnits(amountInString, tokenIn.decimals),
      },
      setStatus
    );
  };

  const getTextFieldProps = (field: SwapField): OutlinedInputProps => {
    const isThisFieldActive = activeField === field;
    const token = field === 'amountIn' ? tokenIn : tokenOut;

    return {
      name: field,
      id: field,
      disabled: !token || (!isThisFieldActive && isPending),
      color: 'primary',
      fullWidth: true,
      required: true,
      label: field === 'amountIn' ? 'From' : 'To',
      placeholder: '0',
      value: field === 'amountIn' ? amountInString : amountOutString,
      endAdornment: (
        <InputAdornment position="end">{token?.symbol}</InputAdornment>
      ),

      onChange: (e) => onAmountChange(e.target.value, field),
      onFocus: () => setActiveField(field),
    };
  };
  return {
    isPending,
    isInput,
    amountInString,
    amountOutString,
    status,
    handleSwap,
    getTextFieldProps,
  };
};
export default useInputConrtoll;
