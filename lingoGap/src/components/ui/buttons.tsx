import { Button } from '@heroui/react'

type ActionButtonsProps = {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export function ActionButtons({ isRecording, startRecording, stopRecording }: ActionButtonsProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
    
      {isRecording && (
        <Button
          size="lg"
          variant="danger"
          className="rounded-xl px-6 py-3 font-medium transition-all bg-red-600 text-white hover:bg-red-500"
          onPress={stopRecording}
        >
          Stop Recording
        </Button>
      )}
      <Button
        variant={isRecording ? 'danger' : 'ghost'}
        size="lg"
        className={`rounded-xl px-6 py-3 font-medium transition-all ${
          isRecording
            ? 'opacity-60 cursor-not-allowed'
            : 'bg-emerald-600 text-white hover:bg-emerald-500'
        }`}
        onPress={startRecording}
        isDisabled={isRecording}
      >
        {isRecording ? (
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Recording...
          </span>
        ) : (
          'Start Recording'
        )}
      </Button>
    </div>
  )
}
