import clsx from 'clsx';
import ListCard from '@/components/ListCard';
import CounterCard from '@/components/CounterCard';
import { Button } from '@/components/ui/button';
import Loading from './loading';

const getData = ()=>{
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve([])
    }, 1000)
  })
}

export default async function Argument() {
  const argus = [
    {
      id: 1,
      type: 'argument',
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`,
      evidence: [
        {
          id: 1,
          description: 'The horizon looks flat',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 2,
          description: 'The Earth looks flat from an airplane',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 3,
          description: 'The Earth looks flat from a mountain',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
      ],
      fallacies: [
        {
          id: 1,
          name: 'Ad Hominem',
        },
        {
          id: 2,
          name: 'Strawman',
        },
      ],
    },
    {
      id: 2,
      type: 'argument',
      content: 'The Earth is flat because it looks flat',
      evidence: [
        {
          id: 1,
          description: 'The horizon looks flat',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 2,
          description: 'The Earth looks flat from an airplane',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 3,
          description: 'The Earth looks flat from a mountain',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
      ],
      fallacies: [
        {
          id: 1,
          name: 'Ad Hominem',
        },
        {
          id: 2,
          name: 'Strawman',
        },
      ],
    },
    {
      id: 3,
      type: 'argument',
      content: 'The Earth is flat because it looks flat',
      evidence: [
        {
          id: 1,
          description: 'The horizon looks flat',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 2,
          description: 'The Earth looks flat from an airplane',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 3,
          description: 'The Earth looks flat from a mountain',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
      ],
      fallacies: [
        {
          id: 1,
          name: 'Ad Hominem',
        },
        {
          id: 2,
          name: 'Strawman',
        },
      ],
    },
    {
      id: 4,
      type: 'counter-argument',
      content: 'The Earth is flat because it looks flat',
      evidence: [
        {
          id: 1,
          description: 'The horizon looks flat',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 2,
          description: 'The Earth looks flat from an airplane',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 3,
          description: 'The Earth looks flat from a mountain',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
      ],
      fallacies: [
        {
          id: 1,
          name: 'Ad Hominem',
        },
        {
          id: 2,
          name: 'Strawman',
        },
      ],
    },
    {
      id: 5,
      type: 'counter-argument',
      content: 'The Earth is flat because it looks flat',
      evidence: [
        {
          id: 1,
          description: 'The horizon looks flat',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 2,
          description: 'The Earth looks flat from an airplane',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 3,
          description: 'The Earth looks flat from a mountain',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
      ],
      fallacies: [
        {
          id: 1,
          name: 'Ad Hominem',
        },
        {
          id: 2,
          name: 'Strawman',
        },
      ],
    },
    {
      id: 6,
      type: 'argument',
      content: 'The Earth is flat because it looks flat',
      evidence: [
        {
          id: 1,
          description: 'The horizon looks flat',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 2,
          description: 'The Earth looks flat from an airplane',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 3,
          description: 'The Earth looks flat from a mountain',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
      ],
      fallacies: [
        {
          id: 1,
          name: 'Ad Hominem',
        },
        {
          id: 2,
          name: 'Strawman',
        },
      ],
    },
    {
      id: 7,
      type: 'counter-argument',
      content: 'The Earth is flat because it looks flat',
      evidence: [
        {
          id: 1,
          description: 'The horizon looks flat',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 2,
          description: 'The Earth looks flat from an airplane',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
        {
          id: 3,
          description: 'The Earth looks flat from a mountain',
          link: 'https://en.wikipedia.org/wiki/Flat_Earth',
        },
      ],
      fallacies: [
        {
          id: 1,
          name: 'Ad Hominem',
        },
        {
          id: 2,
          name: 'Strawman',
        },
      ],
    },
  ]

  const data = await getData();
  
  const GetCard = ({index}) => {
    const tempArgs = [];
    const argType = argus[index].type;
    const isArgument = argType === 'argument';

    for (let i = index; i < argus.length; i += 1) {
      const arg = argus[i];
      if (arg.type !== argType) {
        break;
      }
      tempArgs.push(arg);
    }

    const key = tempArgs.reduce((acc, arg) => acc + String(arg.id) + "-", "");

    return (
      <div key={key} className={clsx('flex', 'flex-col', isArgument ? 'items-start' : 'items-end')}>
        <ListCard 
          className="w-11/12 sm:w-10/12 md:w-8/12 overflow-auto" 
          maxHeight="600px"
          showMore={Math.random() < 0.5}>
          {tempArgs.map((arg) => (
            <CounterCard key={arg.id} arg={arg} />
          ))}
        </ListCard>
      </div>
    );
  };

  const nums = argus.reduce((acc, arg, i) => {
    if (i === 0 || argus[i - 1].type !== arg.type) {
      acc.push(i);
    }
    return acc;
  }, []);

  return (
      <>
        <div className="text-xl font-normal my-5 flex">
          <h1 className='flex-1'>The Earth is flat because it looks flat</h1>
        </div>
        <div className='space-y-3'>
          {nums.map((num) => <GetCard index={num} />)}
        </div>
      </>
  );
}
