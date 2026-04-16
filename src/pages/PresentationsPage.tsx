import { motion } from 'framer-motion';
import { subjects, presentations } from '@/data';
import { PresentationCard } from '@/widgets/presentation';

export function PresentationsPage() {
  const getSubject = (subjectId: string) => subjects.find((s) => s.id === subjectId);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Презентации</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Интерактивные презентации для изучения материала
        </p>
      </motion.div>

      {presentations.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Презентации не найдены
        </div>
      ) : (
        <motion.div 
          className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {presentations.map((presentation, index) => (
            <PresentationCard
              key={presentation.id}
              presentation={{
                id: presentation.id,
                subjectId: presentation.subjectId,
                title: presentation.title,
                description: `Презентация к лекции ${presentation.lectureId.replace(/.*-/, '')}`,
              }}
              subject={getSubject(presentation.subjectId)}
              index={index}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
