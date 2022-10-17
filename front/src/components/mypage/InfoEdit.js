import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { onModalOpen } from '../../store/features/modalSlice';
import InputForm from '../reusable/InputForm';
import PrimaryButton from '../reusable/PrimaryButton';
import TermMarketing from '../form/join/TermMarketing';
import Portal from '../../Portal';
import DaumPostcode from './DaumPostcode';
import dataJoinTerms from '../../assets/api/dataJoinTerms';
import { IoIosArrowForward } from 'react-icons/io';
import { Join, Form } from '../../styles/mypage/info_edit';
import { Terms } from '../../styles/form/join/join_terms';

const InfoEdit = () => {
  const [inputEdit, setInputEdit] = useState({});
  const [inputAble, setInputAble] = useState({});
  const detailedAddressRef = useRef();
  const newEmailRef = useRef();
  const newPasswordRef = useRef();

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.page.userId);
  const isModal = useSelector((state) => state.modal.isModal);

  const onInputEditChanged = (e) => {
    const { name, value } = e.target;
    setInputEdit({ ...inputEdit, [name]: value });
  };

  const onCheckEdit = (e) => {
    const { name } = e.target;
    setInputEdit({
      ...inputEdit,
      [name]: !inputEdit[name],
    });
  };

  const onEditPrimary = (name, e) => {
    e.preventDefault();
    setInputAble({ ...inputAble, [name]: !inputAble[name] });
  };

  const onSearchAddress = (e) => {
    e.preventDefault();
    dispatch(onModalOpen({ component: 'searchAddress', isModal: true }));
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await axios.post('http://localhost:8888/mypage/fetchUserInfo', {
        userId,
      });
      if (!response.data[0]) return;
      const marketingChecked = response.data[0].checkMarketing === 'Y' ? true : false;
      setInputEdit({ ...response.data[0], checkMarketing: marketingChecked });
    };
    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (newPasswordRef.current && inputAble.password) newPasswordRef.current.focus();
    if (newEmailRef.current && inputAble.email) newEmailRef.current.focus();
  }, [inputAble]);

  return (
    <>
      <Join>
        <h1>회원 정보</h1>
        <Form className='vertical_flex' align='start'>
          <InputForm
            label='현재 이메일'
            className='ovalInputWithButton'
            row_set={inputAble.email ? true : false}
            name='email'
            placeHolder='현재 이메일'
            button={inputAble.email ? '수정 취소' : '수정'}
            value={inputEdit.email || ''}
            disabled={true}
            btnClickMethod={(e) => onEditPrimary('email', e)}
          />
          {inputAble.email && (
            <>
              <InputForm
                label='새 이메일'
                className='ovalInputWithButton'
                row_set='true'
                name='newEmail'
                placeHolder='새 이메일'
                button='인증 요청'
                outerRef={newEmailRef}
              />
              <InputForm
                label='인증번호'
                className='ovalInputWithButton'
                name='emailVerifyCode'
                placeHolder='인증번호 입력'
                condition='제한 시간 내로 입력해주세요'
                button='확인'
              />
            </>
          )}

          <InputForm
            label='비밀번호'
            className='ovalInputWithButton'
            row_set={inputAble.password ? true : false}
            type='password'
            name='password'
            placeHolder='비밀번호'
            button={inputAble.password ? '수정 취소' : '수정'}
            value='12345678'
            disabled={inputAble.password ? false : true}
            btnClickMethod={(e) => onEditPrimary('password', e)}
          />

          {inputAble.password && (
            <div className='horizontal_flex'>
              <InputForm
                label='새 비밀번호'
                className='oval pw_check'
                type='password'
                name='newPassword'
                placeHolder='새 비밀번호'
                condition='영문과 숫자 포함하여 8~20자'
                outerRef={newPasswordRef}
              />
              <InputForm
                label='새 비밀번호 확인'
                className='oval pw_check'
                type='password'
                name='newPasswordCheck'
                placeHolder='새 비밀번호 확인'
              />
            </div>
          )}

          <div className='horizontal_flex'>
            <InputForm
              label='이름'
              className='oval'
              name='userName'
              placeHolder='이름'
              value={inputEdit.userName || ''}
              changeMethod={onInputEditChanged}
            />
            <InputForm
              label='연락처'
              className='oval'
              name='phone'
              placeHolder='연락처'
              condition=' - 제외하고 번호 입력'
              value={inputEdit.phone || ''}
              changeMethod={onInputEditChanged}
            />
          </div>

          <InputForm
            label='우편번호'
            className='ovalInputWithButton'
            row_set={true}
            name='zipCode'
            placeHolder='우편번호'
            readOnly={true}
            button='검색'
            btnClickMethod={onSearchAddress}
            value={inputEdit.zipCode || ''}
          />
          <InputForm
            label='기본주소'
            className='oval'
            row_set={true}
            name='address'
            placeHolder='기본주소'
            readOnly={true}
            value={inputEdit.address || ''}
          />
          <InputForm
            label='상세주소'
            className='oval'
            name='detailedAddress'
            placeHolder='상세주소'
            value={inputEdit.detailedAddress || ''}
            changeMethod={onInputEditChanged}
            outerRef={detailedAddressRef}
          />

          {isModal.searchAddress && (
            <Portal>
              <DaumPostcode
                termHeader={'우편번호 찾기'}
                inputEdit={inputEdit}
                setInputEdit={setInputEdit}
                detailedAddressRef={detailedAddressRef}
              />
            </Portal>
          )}

          <div>
            <fieldset>
              <legend>성별</legend>
              <input type='radio' id='sexmale' name='checkSex' value='male' />
              <label htmlFor='sexmale'>남자</label>
              <input type='radio' id='sexFemale' name='checkSex' value='female' />
              <label htmlFor='sexFemale'>여자</label>
            </fieldset>
          </div>

          <Terms>
            <li key={'checkMarketing'}>
              <input
                type='checkbox'
                id={'checkMarketing'}
                name={'checkMarketing'}
                checked={inputEdit.checkMarketing}
                onChange={() => onCheckEdit('checkMarketing')}
              />

              <label htmlFor={'checkMarketing'}>{dataJoinTerms[4].header}</label>
              {dataJoinTerms[4].detail && (
                <span className={dataJoinTerms[4].detailClassName}>&nbsp;{dataJoinTerms[4].detail}</span>
              )}

              <IoIosArrowForward
                className='termBtn'
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(onModalOpen({ component: 'joinTerm', isModal: 4 }));
                }}
              />

              {isModal.joinTerm === 4 && (
                <Portal>
                  <TermMarketing termHeader={dataJoinTerms[4].header.slice(0, -3)} />
                </Portal>
              )}
            </li>
          </Terms>

          <div className='horizontal_flex_button'>
            <PrimaryButton buttonName={'취소하기'} className={'cancel'} />
            <PrimaryButton type={'submit'} buttonName={'수정하기'} />
          </div>
        </Form>
      </Join>
    </>
  );
};

export default InfoEdit;
