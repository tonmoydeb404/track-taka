import { orderBy, query } from "@firebase/firestore";
import React, { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Helmet } from "react-helmet";
import { BsArrowLeft, BsPlusLg } from "react-icons/bs";
import { Link } from "react-router-dom";
import FeedbackCard, {
  FeedbackCardSkeleton,
} from "../common/components/Feedback/FeedbackCard";
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
        <div className="flex flex-wrap items-center mb-16 gap-3">
          <Link to={-1}>
            <BsArrowLeft className="text-xl" />
          </Link>
          <h2 className="text-2xl font-bold mr-auto">Our users feedback</h2>
          <button className="btn btn-warning" onClick={viewCreateFrom}>
            <BsPlusLg />
            Submit Feedback
          </button>
        </div>

        {error && !loading && !value ? (
          <div>Something wents to wrong!</div>
        ) : null}

        {!error && loading && !value ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
            <FeedbackCardSkeleton />
            <FeedbackCardSkeleton />
            <FeedbackCardSkeleton />
            <FeedbackCardSkeleton />
            <FeedbackCardSkeleton />
          </div>
        ) : null}

        {!error && !loading && value ? (
          value.length ? (
            <div className="columns-1 md:columns-2 lg:columns-3 2xl:columns-4 gap-3 [column-fill:_balance] box-border mx-auto ">
              {value.map((feedback) => (
                <div className="break-inside-avoid mb-3" key={feedback.id}>
                  <FeedbackCard name={feedback.name} text={feedback.text} />
                </div>
              ))}
            </div>
          ) : (
            <div>Share your feedback about us.</div>
          )
        ) : null}

        <Modal
          isOpen={showCreateForm}
          onClose={hideCreateFrom}
          title={"Share your feedback"}
        >
          <FeedbackCreateForm
            onFormCancel={hideCreateFrom}
            onFormSubmit={hideCreateFrom}
          />
        </Modal>
      </div>
    </>
  );
};

export default Feedback;
