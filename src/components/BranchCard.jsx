"use client"

import Comments from "./Comments" 

export default function BranchCard({ branch, session, onVote, onComment }) {
  return (
    <div className="border p-3 rounded bg-gray-50 dark:bg-gray-700">
      <div className="flex justify-between items-center">
        <span>{branch.content}</span> {}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {branch.votes?.length || 0} голосов
          </span>
          {session && (
            <button
              onClick={() => onVote(branch.id)}
              className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Голосовать
            </button>
          )}
        </div>
      </div>

      {}
      <Comments
        branchId={branch.id}
        comments={branch.comments || []}
        session={session}
        onComment={onComment}
      />
    </div>
  )
}