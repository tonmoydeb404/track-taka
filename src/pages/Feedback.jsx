import { orderBy, query } from "@firebase/firestore";
import React, { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Helmet } from "react-helmet";
import FeedbackCard from "../common/components/Feedback/FeedbackCard";
import FeedbackCreateForm from "../common/components/Feedback/FeedbackCreateForm";
import Modal from "../common/components/Modal";
import { feedbacksCollection } from "../firebase";
const Feedback = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const q = query(feedbacksCollection, orderBy("createdAt", "desc"));
  const [value, loading, error] = useCollectionData(q);

  const hideCreateFrom = () => setShowCreateForm(false);
  const viewCreateFrom = () => setShowCreateForm(true);

  return (
    <>
      <Helmet>
        <title>Feedback - Track Taka</title>
      </Helmet>
      <div className="container w-full min-h-screen py-10">
        <div className="flex flex-wrap items-center justify-between mb-16 gap-3">
          <h2 className="text-2xl font-bold ">Our users feedback</h2>
          <button className="btn btn-warning" onClick={viewCreateFrom}>
            Submit Feedback
          </button>
        </div>

        {!loading && !error && value ? (
          <div className="columns-1 md:columns-2 lg:columns-3 2xl:columns-4 gap-3 [column-fill:_balance] box-border mx-auto ">
            {value.map((feedback) => (
              <div className="break-inside-avoid mb-3" key={feedback.id}>
                <FeedbackCard name={feedback.name} text={feedback.text} />
              </div>
            ))}
          </div>
        ) : (
          "nothing is here"
        )}

        <Modal
          isOpen={showCreateForm}
          onClose={hideCreateFrom}
          title={"Share your feedback"}
        >
          <FeedbackCreateForm
            onFormCancel={hideCreateFrom}
            afterFormSubmit={hideCreateFrom}
          />
        </Modal>
      </div>
    </>
  );
};

export default Feedback;
